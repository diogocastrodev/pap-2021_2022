

const routes = {
    redirect: (url: string) => {
        if(typeof window !== "undefined") window.location.assign(url);
    },
    reload: () => {
        if(typeof window !== "undefined") window.location.reload();
    }
}

export {
    routes
}