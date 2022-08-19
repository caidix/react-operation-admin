import { deepRemoveBlank } from "../format";

/**
 * http 错误类, 携带错误码
 */
export class HttpError extends Error {
  _code: number;
  constructor(code: number, msg: string) {
    super(msg);
    this._code = code;
  }

  get code(): number {
    return this._code;
  }
}
/**
 * 请求包裹函数
 * @param asyncTask
 * @param params
 */
export async function requestExecute<P, R = any>(
    asyncTask: (param: P) => Promise<R>,
    params: P,
    options?: {
      trim?: boolean;
    },
): Promise<[HttpError, null] | [null, R]> {
  try {
    const { trim = true } = options || {};
    const arg = trim ? deepRemoveBlank(params) : params;
    const res = await asyncTask.call(undefined, arg);
    return [null, res];
  } catch (e: any) {
    return [e, null];
  }
}
