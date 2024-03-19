export default class TasksModel {
      id: string;
      title: string;
      details: string;
      datelimit: Date;
      renders: { user: string, script: string }[];
      correction: string;
    constructor(
      id: string,
      title: string,
      details: string,
      datelimit: Date,
      renders: { user: string, script: string }[],
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