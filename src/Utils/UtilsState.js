
export let modifyStateProperty = (state, setState, key, value) => {
    setState({
        ...state,
        [key]: value
    });
}

export let modifyStatePropertyWithStep = (setState, key, value) => {
    setState(prevState => ({
        ...prevState,
        [key]: value
    }));
};