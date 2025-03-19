const express = require('express');
const {getSkincareRoutineList, addProductToSkincareRoutine} = require('../controller/skincare-routine.controller');
const {authMiddleware, adminAuthorities} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, adminAuthorities ,getSkincareRoutineList);
router.put('/:routineId/steps/:stepNumber', authMiddleware, adminAuthorities ,addProductToSkincareRoutine);

module.exports = router;