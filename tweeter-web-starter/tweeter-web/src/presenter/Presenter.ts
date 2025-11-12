export interface View {
  displayErrorMessage: (error: string) => void;
}

export class Presenter<T extends View> {
  private _view: T;

  protected constructor(veiw: T) {
    this._view = veiw;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operationDescription: string,
    operation: () => Promise<void>
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    }
  }
}
