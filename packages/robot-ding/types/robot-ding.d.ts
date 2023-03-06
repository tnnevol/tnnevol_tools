interface DintSendAt {
  /** 被@人的手机号。 */
  atMobiles?: string[];
  /** 被@人的用户userid。 */
  atUserIds?: string[];
  /** 是否@所有人。 */
  isAtAll?: boolean;
}
/* text */
interface DingSendText {
  content: string;
}
export declare interface DingSendTextParams {
  at: DintSendAt;
  text: DingSendText;
  msgtype: "text";
}
export declare interface DingTextConfig extends DintSendAt, DingSendText {}
/*  */

/* link */
interface DingSendLink {
  /** 消息标题 (required) */
  title: string;
  /** 消息内容。如果内容太长只会部分展示 (required) */
  text: string;
  /** 点击消息跳转的URL (required) */
  messageUrl: string;
  /** 图片URL */
  picUrl?: string;
}
export declare interface DingSendLinkParams {
  msgtype: "link";
  link: DingSendLink;
}
export declare type DingLinkConfig = DingSendLink;
/*  */

/* markdown */
interface DingSendMarkdown {
  /** 首屏会话透出的展示内容。 (required) */
  title: string;
  /** markdown格式的消息 (required) */
  text: string;
  at?: DintSendAt;
}
export declare interface DingSendMarkdownParams {
  msgtype: "markdown";
  markdown: DingSendMarkdown;
}
export declare interface DingMarkdownConfig extends DintSendAt {
  /** 首屏会话透出的展示内容。 (required) */
  title: string;
  /** markdown格式的消息 (required) */
  text: string;
}
/*  */

/* actionAcrd */
interface DingSendActionCard {
  /** 首屏会话透出的展示内容。 (required) */
  title: string;
  /** markdown格式的消息 (required) */
  text: string;
  /** 0：按钮竖直排列 1：按钮横向排列 */
  btnOrientation?: 0 | 1;
}
interface DingSendSingleBtnActionCard extends DingSendActionCard {
  /** 单个按钮的标题 */
  singleTitle: string;
  /** 点击消息跳转的URL */
  singleURL: string;
}

type ActionCardBtnType = {
  /** 按钮标题 */
  title: string;
  /** 点击按钮触发的URL */
  actionURL: string;
};
interface DingSendMoreBtnActionCard extends DingSendActionCard {
  /** 按钮 */
  btns: ActionCardBtnType[];
}
export declare interface DingSendActionCardParams {
  msgtype: "actionCard";
  actionCard: DingSendSingleBtnActionCard | DingSendMoreBtnActionCard;
}
export declare type DingSingleBtnActionCardConfig = DingSendSingleBtnActionCard;
export declare type DingMoreBtnActionCardConfig = DingSendMoreBtnActionCard;
/*  */

/* feedCard */
type FeedCardLinkType = {
  title: string;
  messageURL: string;
  picURL: string;
};
interface DingSendFeedCard {
  links: FeedCardLinkType[];
}
export declare interface DingSendFeedCardParams {
  msgtype: "feedCard";
  feedCard: DingSendFeedCard;
}
export declare type DingFeedCardConfig = DingSendFeedCard;
/*  */

export declare type DingMessageType =
  | "text"
  | "link"
  | "markdown"
  | "actionCard"
  | "feedCard";

export declare interface RobotDingConfig {
  webhook: string;
  secret: string;
}
// 用去
export declare type DingConfig =
  | DingTextConfig
  | DingLinkConfig
  | DingMarkdownConfig
  | DingSingleBtnActionCardConfig
  | DingMoreBtnActionCardConfig
  | DingFeedCardConfig;

export declare type DingSendParams =
  | DingSendTextParams
  | DingSendLinkParams
  | DingSendMarkdownParams
  | DingSendActionCardParams
  | DingSendFeedCardParams;

export default class RobotDing {
  protected webhook: string;
  protected secret: string;
  constructor(config: RobotDingConfig);
  sendDing<T = any>(config: DingConfig, msgtype?: DingMessageType): Promise<T>;
  protected sendService<T = any>(
    postData: DingSendParams,
    timestamp: number,
    sign: string
  ): Promise<T>;
}
