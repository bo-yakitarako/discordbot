type Embed = {
  author?: {
    name?: string;
    icon_url?: string;
  };
  title?: string;
  url?: string;
  color?: number;
  description?: string;
  fields?: {
    name: string;
    value: string;
  }[];
};

const color = 0xce9eff;

const mainHelp: Embed = {
  title: 'スコアタのヘルプ',
  color,
  fields: [
    {
      name: '!register [ユーザーネーム]',
      value:
        'Sparebeatと連携するためのコマンドだよ\n' +
        '[ユーザーネーム]の部分には**Sparebeat登録時に設定した半角英数字**を指定しましょう！\n' +
        '例) 吉田(kittahouse)と連携する→`!register kittahouse`\n' +
        '誰かが一度Sparebeatアカウントと連携しちゃうと、その人が連携解除するまで他の人がそのアカウントと連携することはできなくなっちゃうんだ\n' +
        '**連携するのは自分で登録したアカウント**にしましょう！他のアカウント連携する意味もないしね',
    },
    {
      name: '!unregister',
      value: '連携してあるSparebeatアカウントを解除します。~~使い所の少なさ~~',
    },
    {
      name: '!set [難易度] [曲指定]',
      value: '曲を設定するコマンドだよ。詳細は`!sethelp`で確認してください！',
    },
    {
      name: '!current',
      value: '現在設定されている曲を表示します！',
    },
    {
      name: '!finish',
      value:
        '設定された曲を削除して、スコアタを終了します！\nこれをやると`!current`でも何も表示されなくなるよ',
    },
    {
      name: '!score',
      value:
        'タイムラインの投稿データを読み取って、スコアをbot用のデータベースに保存するよ！\n' +
        '対象の譜面をプレイしたら**タイムラインに投稿して**、投稿後**3分以内**にこのコマンドを打ってください！\n' +
        '3分過ぎちゃったらもう一回やるハメになりそうだしめんどうだね',
    },
    {
      name: '!ranking [数値]',
      value:
        'スコアタの合計スコアをランキング形式で表示します！\n' +
        '[数値]の部分は何時間前までのスコア記録を反映するかを指定する部分だよ\n' +
        '`!ranking 3`なら3時間前までの`!score`で記録したデータの合計スコアを計算するよ\n' +
        '[数値]の部分を省略して`!ranking`だけでも大丈夫だよ。その場合は6時間前までのデータで計算します！',
    },
    {
      name: '!log',
      value:
        '6時間前までのプレイログを表示します！\n' +
        '過去のプレイログも見たいかもしれなかったら時間指定できるようにしたい',
    },
  ],
};

const setHelp: Embed = {
  title: '曲設定方法のヘルプ',
  color,
  description:
    '```\n!set [難易度] [曲指定]\n```' +
    '**[難易度]**\n' +
    '譜面の難易度を指定します！以下の文字を入れて指定しましょう\n' +
    'EASY譜面を指定する場合: `1, e, easy, E, EASY`\n' +
    'NORMAL譜面を指定する場合: `2, n, normal, N, NORMAL`\n' +
    'HARD譜面を指定する場合: `3, h, hard, H, HARD`\n\n' +
    '**[曲指定]**\n' +
    'URLを入れる、曲IDを入れる、検索文字列を入れる、といった三種類方法があります！\n\n' +
    '*1. URLを入れる、2. 曲IDを入れる*\n' +
    '曲のURLを貼り付けちゃえば曲が指定できるよ！曲IDはURLの末尾に付いてる8文字の変な文字のことだよ\n' +
    '例えば、[Liberty](https://beta.sparebeat.com/play/0d9cf28a)のHARD譜面をやろうと思ったら、\n' +
    '```\n!set h https://beta.sparebeat.com/play/0d9cf28a \n```だったり、\n' +
    '```\n!set 3 0d9cf28a\n```みたいな感じだよ\n\n' +
    '*3. 検索文字列を入れる*\n' +
    '曲のタイトルで検索して設定するためのコマンドです！たとえば、\n' +
    '```\n!set n blessing from\n```' +
    'とすると[Blessing Beat From Heaven](https://beta.sparebeat.com/play/2c121aac)のNORMAL譜面が設定されます！\n' +
    'ただ検索結果が複数出る場合もあるよね？そういう場合は別のメッセージが送信されて選択を促します！',
};

export { mainHelp, setHelp };
