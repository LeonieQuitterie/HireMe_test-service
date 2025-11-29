import { Router } from 'express';
import { CandidateBigFiveController } from '../controllers/candidate-big-five.controller';
import { authenticate, restrictTo } from '../middleware/auth.middleware';


const router = Router();

router.get(
  '/scores/:candidateId/:testId',
  authenticate,
  restrictTo('HR'),
  CandidateBigFiveController.getSubmissionScores
);

router.get(
  '/:candidateId/:testId',
  authenticate,
  restrictTo('HR'),
  CandidateBigFiveController.getByCandidateAndTest
);


export default router;