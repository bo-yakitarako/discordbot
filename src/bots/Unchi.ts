import { Message } from 'discord.js';
import { Bot } from './Bot';

class Unchi extends Bot {
  protected ready(): void {
    console.log('漏れた');
  }

  protected message(message: Message): void {
    if (message.author.bot) {
      return;
    }
    if (message.content === '!unchi') {
      if (Math.random() < 0.2) {
        message.channel.send('**うんち**');
      } else {
        const words: Array<string> = [
          'おほほ',
          'なんだね',
          'うるさいぞ',
          'わかる',
          'やる気出せ',
          'んー',
          'そうとも言う',
          'それは違う',
          'よし',
          'へー',
          'メンタルかよ',
          '端からやれ',
          '意味わからん',
          'やるじゃん',
          '図に乗るな',
          'そうかもしれない',
          'それな～～～～～～',
          'まあね',
          'かしこかしこまりましたかしこ',
          'きっしょ',
          '海に沈んじまえ',
          'そんなー',
          'クニに帰れ',
        ];
        message.channel.send(words[Math.floor(words.length * Math.random())]);
      }
    }
  }
}

export { Unchi };
