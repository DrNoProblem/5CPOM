export default class TaskModel {
      _id: string;
      title: string;
      details: string;
      datelimit: Date;
      renders: { id: string, script: string }[];
      correction: string;
    constructor(
      _id: string,
      title: string,
      details: string,
      datelimit: Date,
      renders: { id: string, script: string }[],
      correction: string,
    ) {
        this._id = _id;
        this.title = title;
        this.details = details;
        this.datelimit = datelimit;
        this.renders = renders;
        this.correction = correction;
    }
}