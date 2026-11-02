/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre sales report API for the sales reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions', (req, res, next) => {
  try {
    mongo (async db => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions/:region', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /by-time-period
 * 
 * Fetches sales data within a specified date range, grouped by day
 */

router.get('/by-time-period', (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).send({ 
        message: 'Start date and end date are required.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return res.status(400).send({ 
        message: 'Please provide a valid date range.'
      });
    }

    // Include the entire selected end date.
    end.setUTCDate(end.getUTCDate() + 1);

    mongo(async db => {
      const salesReportByTimePeriod = await db.collection('sales').aggregate([
        {
          $match: {
            date: { $gte: start, $lt: end }
          }
        },
        {
          $group: {
            _id: { 
              $dateToString: { 
                format: '%Y-%m-%d', 
                date: '$date', 
                timezone: 'UTC' 
              } 
            },
            totalSales: { $sum: '$amount' }
          }
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { date: 1 }
        }
      ]).toArray();
      res.send(salesReportByTimePeriod);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for time period: ', err);
    next(err);
  }
});
module.exports = router;