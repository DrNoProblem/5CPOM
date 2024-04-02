export default class TaskModel {
      id: string;
      title: string;
      details: string;
      datelimit: Date;
      renders: { id: string, script: string }[];
      correction: string;
    constructor(
      id: string,
      title: string,
      details: string,
      datelimit: Date,
      renders: { id: string, script: string }[],
      correction: string,
    ) {
        this.id = id;
        this.title = title;
        this.details = details;
        this.datelimit = datelimit;
        this.renders = renders;
        this.correction = correction;
    }
}