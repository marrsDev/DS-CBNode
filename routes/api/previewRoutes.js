// routes/api/previewRoutes.js
const express = require('express');
const router = express.Router();

const PREVIEW_MAP = {
  // Sliding windows (index.html)
  'sliding': {
    '2-noPartition': 'type-1',
    '2-fixedTop': 'type-2',
    '2-fixedBottom': 'type-2',
    '2-doubleFixed': 'type-3',
    '3-noPartition': 'type-4',
    '3-fixedTop': 'type-5',
    '3-fixedBottom': 'type-5',
    '3-doubleFixed': 'type-6',
    '4-noPartition': 'type-7',
    '4-fixedTop': 'type-8',
    '4-fixedBottom': 'type-8',
    '4-doubleFixed': 'type-9',
    '2-openAbleTopFxBtm': 'type-10',
    '3-openAbleTopFxBtm': 'type-11',
    '4-openAbleTopFxBtm': 'type-12',
    '2-openAbleTop': 'type-17',
    '3-openAbleTop': 'type-18',
    '4-openAbleTop': 'type-19',
  },

// Top-hung windows
  'top-hung': {
    'singlePanel': 'type-13',
    'doublePanel': 'type-14',
    'customLight': 'type-15',
    'centerHung': 'type-16',
  },

// Folding doors
  'folding': {
    'folding4': 'type-20',
    'folding3': 'type-21',
  },
}

const TYPE_CODES = {
    'type-1': '#sw001',
    'type-2': '#sw002',
    'type-3': '#sw003',
    'type-4': '#sw004',
    'type-5': '#sw005',
    'type-6': '#sw006',
    'type-7': '#sw007',
    'type-8': '#sw008',
    'type-9': '#sw009',
    'type-10': '#sw010',
    'type-11': '#sw011',
    'type-12': '#sw012',
    'type-13': '#th013',
    'type-14': '#th014',
    'type-15': '#cw015',
    'type-16': '#ch016',
    'type-17': '#sw017',
    'type-18': '#sw018',
    'type-19': '#sw019',
    'type-20': '#fd020',
    'type-21': '#fd021',
};

// Route to get preview image and type ID
router.get('/', (req, res) => {
  const { windowType, config } = req.query;

  if (!windowType || !config) {
    return res.status(400).json({ error: 'Missing windowType or config parameters' });
  }

  const type = PREVIEW_MAP[windowType]?.[config];
  const typeId = TYPE_CODES[type];

  if (type) {
    res.json({
      imageUrl: `/img/previewLabels/${type}.png`,
      typeId: typeId || ''
    });
  } else {
    res.status(404).json({
      error: 'Preview image not found for the given configuration',
      imageUrl: '/img/previewLabels/type-1.png', // Fallback image
      typeId: ''
    });
  }
});

module.exports = router;