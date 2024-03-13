

export default class DrawModel {
    id: string;
    date: Date;
    script: string;
    url: string;
  constructor(
    id: string,
    date: Date,
    script: string,
    url: string,
  ) {
      this.id = id;
      this.date = date;
      this.script = script;
      this.url = url;
  }
}