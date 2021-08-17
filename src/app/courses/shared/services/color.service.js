import { Service } from 'appable';

export const ColorService = new class extends Service {

    colorList = {
        a: 'green-500',
        b: 'purple-500',
        c: 'blue-grey-800',
        d: 'grey-800',
        e: 'red-600',
        f: 'blue-500',
        g: 'grey-600',
        h: 'deep-orange-500',
        i: 'blue-500',
        j: 'yellow-700',
        k: 'grey-800',
        l: 'pink-500',
        m: 'lime-500',
        n: 'green-500',
        o: 'amber-500',
        p: 'deep-purple-500',
        q: 'brown-500',
        r: 'cyan-500',
        s: 'light-blue-500',
        t: 'indigo-500',
        u: 'pink-500',
        v: 'teal-500',
        w: 'red-600',
        x: 'light-green-500',
        y: 'deep-orange-500',
        z: 'cyan-500',
    };

    get(word) {
        return this.colorList[word[0].toLowerCase()];
    }

}();
