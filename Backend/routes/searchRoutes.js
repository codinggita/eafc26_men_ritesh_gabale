const express = require('express');
const { searchLaws } = require('../controllers/searchController');

const router = express.Router();

router.get('/laws', searchLaws);

module.exports = router;
