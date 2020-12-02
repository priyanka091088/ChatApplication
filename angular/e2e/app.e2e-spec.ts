import { ChatApplicationTemplatePage } from './app.po';

describe('ChatApplication App', function() {
  let page: ChatApplicationTemplatePage;

  beforeEach(() => {
    page = new ChatApplicationTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
