type DrinksGrabberResult = {
  success: SourceDrinkModel[];
  failure: any[];
};

type DrinkFetchingReport = {
  success: boolean;
  data?: SourceDrinkModel;
  error?: any;
};
