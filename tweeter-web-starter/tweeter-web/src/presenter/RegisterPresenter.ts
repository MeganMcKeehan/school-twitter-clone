import { Buffer } from "buffer";
import {
  AuthenticatePresenter,
  AuthenticateVeiw,
} from "./AuthenticatePresenter";

export interface Registerview extends AuthenticateVeiw {
  setImageFileExtension: (ext: string) => void;
  setImageUrl: (url: string) => void;
}

export class RegisterPresenter extends AuthenticatePresenter<Registerview> {
  protected getOperationDescription(): string {
    return "register user";
  }
  imageBytes: Uint8Array = new Uint8Array();

  constructor(view: Registerview) {
    super(view);
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    this.doAuthenticateAndNavigate(async () => {
      return this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        imageFileExtension
      );
    }, rememberMe);
  }

  public handleImageFile = (file: File | undefined) => {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  };

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
