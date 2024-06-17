import { AutoRouter } from 'itty-router'
import { profile, feed } from './controllers';

const router = AutoRouter();

router.get('/:username', profile);
router.get('/:username/feed', feed);

export default router;
