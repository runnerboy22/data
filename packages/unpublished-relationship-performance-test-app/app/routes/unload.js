import Route from '@ember/routing/route';
import { run } from '@ember/runloop';

export default Route.extend({
  async model() {
    performance.mark('start-data-generation');
    const payload = await fetch('./fixtures/unload.json').then((r) => r.json());
    performance.mark('start-push-payload');
    const parent = this.store.push(payload);
    performance.mark('start-unload-records');
    const children = await parent.children;

    // runloop to ensure destroy does not escape bounds of the test
    run(() => {
      children.toArray().forEach((child) => child.unloadRecord());
    });
    performance.mark('end-unload-records');
  },
});
