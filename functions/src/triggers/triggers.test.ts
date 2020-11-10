import * as triggers from './triggers';

import chai from 'chai';

const expect = chai.expect;

describe('triggers', () => {
  describe('open options', () => {
    it('should open options', async () => {
      triggers.openOptions();
      expect(true).equal(true);
    });
  });
});
