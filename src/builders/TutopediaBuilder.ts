import { Header, TutopediaState } from "../appdata/appdata";

export class TutopediaBuilder {
  private count: number = 0;
  private routeUrl: string = "not set";
  private sender: string = "not set";
  private message?: string;
  private header?: Header;
  constructor(
    count: number,
    routeUrl: string,
    sender: string,
    message?: string,
    header?: header
  ) {
    this.count = count;
    this.routeUrl = routeUrl;
    this.sender = sender;
    this.message = message;
    this.header = header;
  }

  public build(): TutopediaState {
    return {
      count: this.count,
      routeUrl: this.routeUrl,
      sender: this.sender,
      message: this.message,
      header: this.header,
    };
  }
}
