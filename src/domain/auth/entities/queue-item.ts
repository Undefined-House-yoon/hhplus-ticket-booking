export class QueueItem {

  readonly id: number;
  readonly userId: number;
  private _processed: boolean;
  readonly createdAt?: Date;

  //대기 처리중
  isProcessed(): boolean {
    return this._processed;
  }

  // 대기 끝 입장
  shouldProcess() {
    this._processed = true;
  }

  static create(params: {
    id: number;
    userId: number;
    processed: boolean;
    createdAt?: Date;
  }) {
   return new QueueItem(params);
  }

  private constructor({ id, userId, processed, createdAt }: {
    id: number;
    userId: number;
    processed: boolean;
    createdAt?: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this._processed = createdAt ? processed : false;
    this.createdAt = createdAt;
  }


}
