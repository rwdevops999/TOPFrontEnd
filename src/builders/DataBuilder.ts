import { Data } from "../appdata/appdata";

export class DataBuilder {
  private error?: string = "";
  private reload?: boolean = false;
  private updateMode?: boolean = false;
  private updateId?: number = -1;
  private viewmode?: "All" | "Pub" | "Unpub" | "id" | "keyword";
  private searchId?: number;
  private keywords?: string[];

  constructor() {}

  public setError(error: string) {
    this.error = error;
  }

  public setReload(reload: boolean) {
    this.reload = reload;
  }

  public setUpdateMode(update: boolean) {
    this.updateMode = update;
  }

  public setUpdateId(id: number) {
    this.updateId = id;
  }

  public setViewMode(mode: "All" | "Pub" | "Unpub" | "id" | "keyword") {
    this.viewmode = mode;
  }

  public setSearchId(id: number) {
    this.searchId = id;
  }

  public setKeywords(keywords?: string[]) {
    this.keywords = keywords;
  }

  public build(): Data {
    return {
      errorMessage: this.error,
      reloadData: this.reload,
      updateMode: this.updateMode,
      updateId: this.updateId,
      viewmode: this.viewmode,
      searchId: this.searchId,
      keywords: this.keywords,
    };
  }
}
