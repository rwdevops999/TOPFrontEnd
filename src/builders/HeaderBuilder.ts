import { HeaderState } from "../appdata/appdata";

export class HeaderBuilder {
  private title: string;
  private subtitle?: string;

  constructor(title: string, subtitle?: string) {
    this.title = title;
    this.subtitle = subtitle;
  }

  public build(): HeaderState {
    return {
      title: this.title,
      subtitle: this.subtitle,
    };
  }
}
