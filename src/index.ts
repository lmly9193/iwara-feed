import { AutoRouter } from 'itty-router';
import { feed } from './controllers';

const router = AutoRouter();

router.get('/:username/:format?', feed);

export default router;
