import { Router, error, json, withParams } from 'itty-router'
import profile from './profile';
import feed from './feed';

const router = Router({
    catch: error,
    finally: [json],
});

router.get('/:username', withParams, profile);
router.get('/:username/feed', feed);

router.all('*', () => error(404));

export default router;
