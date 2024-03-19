import TasksModel from '../tasks-model';

export const voidTask: TasksModel = {
    'id': '',
    'title': '',
    'details': '',
    'datelimit': new Date(0),
    'renders': [],
    'correction': '',
}

export default voidTask;