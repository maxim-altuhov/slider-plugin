type TypeMainView = {
  viewList: Record<string, any>;
  updateViews(options: IPluginOptions): void;
  renderSlider($initSelector: JQuery): void;
  updateModel(event: Event, targetValue?: number): void;
};
