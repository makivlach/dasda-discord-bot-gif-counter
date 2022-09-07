// Credits https://github.com/huckbit/extract-urls

export const extractUrls = (str: string, lower = false) => {
    const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?!&//=]*)/gi;


    if (str) {
        let urls = str.match(regexp);
        if (urls) {
            return lower ? urls.map((item) => item.toLowerCase()) : urls;
        } else {
            undefined;
        }
    } else {
        undefined;
    }
};
