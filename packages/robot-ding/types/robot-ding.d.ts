declare namespace robotDing {}

declare interface DintSendAt {
  /** 被@人的手机号。 */
  atMobiles?: string[];
  /** 被@人的用户userid。 */
  atUserIds?: string[];
  /** 是否@所有人。 */
  isAtAll?: boolean;
}
/* text */
declare interface DingSendText {
  content: string;
}
declare interface DingSendTextParams {
  at: DintSendAt;
  text: DingSendText;
  msgtype: "text";
}
declare interface DingTextConfig extends DintSendAt, DingSendText {}
/*  */

/* link */
declare interface DingSendLink {
  /** 消息标题 (required) */
  title: string;
  /** 消息内容。如果内容太长只会部分展示 (required) */
  text: string;
  /** 点击消息跳转的URL (required) */
  messageUrl: string;
  /** 图片URL */
  picUrl?: string;
}
declare interface DingSendLinkParams {
  msgtype: "link";
  link: DingSendLink;
}
declare type DingLinkConfig = DingSendLink;
/*  */

/* markdown */
declare interface DingSendMarkdown {
  /** 首屏会话透出的展示内容。 (required) */
  title: string;
  /** markdown格式的消息 (required) */
  text: string;
  at?: DintSendAt;
}
declare interface DingSendMarkdownParams {
  msgtype: "markdown";
  markdown: DingSendMarkdown;
}
declare interface DingMarkdownConfig extends DintSendAt {
  /** 首屏会话透出的展示内容。 (required) */
  title: string;
  /** markdown格式的消息 (required) */
  text: string;
}
/*  */

/* actionAcrd */
declare interface DingSendActionCard {
  /** 首屏会话透出的展示内容。 (required) */
  title: string;
  /** markdown格式的消息 (required) */
  text: string;
  /** 0：按钮竖直排列 1：按钮横向排列 */
  btnOrientation?: 0 | 1;
}
declare interface DingSendSingleBtnActionCard extends DingSendActionCard {
  /** 单个按钮的标题 */
  singleTitle: string;
  /** 点击消息跳转的URL */
  singleURL: string;
}

declare type ActionCardBtnType = {
  /** 按钮标题 */
  title: string;
  /** 点击按钮触发的URL */
  actionURL: string;
};
declare interface DingSendMoreBtnActionCard extends DingSendActionCard {
  /** 按钮 */
  btns: ActionCardBtnType[];
}
declare interface DingSendActionCardParams {
  msgtype: "actionCard";
  actionCard: DingSendSingleBtnActionCard | DingSendMoreBtnActionCard;
}
declare type DingSingleBtnActionCardConfig = DingSendSingleBtnActionCard;
declare type DingMoreBtnActionCardConfig = DingSendMoreBtnActionCard;
/*  */

/* feedCard */
declare type FeedCardLinkType = {
  title: string;
  messageURL: string;
  picURL: string;
};
declare interface DingSendFeedCard {
  links: FeedCardLinkType[];
}
declare interface DingSendFeedCardParams {
  msgtype: "feedCard";
  feedCard: DingSendFeedCard;
}
declare type DingFeedCardConfig = DingSendFeedCard;
/*  */

declare type DingMessageType =
  | "text"
  | "link"
  | "markdown"
  | "actionCard"
  | "feedCard";

declare interface RobotDingConfig {
  webhook: string;
  secret: string;
}
// 用去
declare type DingConfig =
  | DingTextConfig
  | DingLinkConfig
  | DingMarkdownConfig
  | DingSingleBtnActionCardConfig
  | DingMoreBtnActionCardConfig
  | DingFeedCardConfig;

declare type DingSendParams =
  | DingSendTextParams
  | DingSendLinkParams
  | DingSendMarkdownParams
  | DingSendActionCardParams
  | DingSendFeedCardParams;

declare class RobotDing {
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
