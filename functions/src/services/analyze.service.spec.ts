
import chai from 'chai';
import sinon from 'sinon';
import { AnalyzeService } from './analyze.service';

const expect = chai.expect;

describe('analyzeService', () => {
  const sinonSandbox = sinon.createSandbox();
  // let getUserSpy: sinon.SinonSpy;
  beforeEach(() => {
    // getUserSpy = sinonSandbox.stub(robinhood, 'getUser')
    //   .returns(Promise.resolve('fake user') as any);
  });
  afterEach(() => sinonSandbox.restore());

  describe('find dip', () => {
    it('should get user', async () => {
      console.log(AnalyzeService);
      // AnalyzeService.findDipPercent({})
      // expect dip percentage to equal
    });

    it('account for splits', async () => {
      console.log(AnalyzeService,expect);
      // AnalyzeService.findDipPercent({})
      // expect dip percentage to equal
    });

  });
});
