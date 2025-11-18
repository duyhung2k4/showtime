const agrs = [...process.argv];
const option = agrs.slice(3, agrs.length);

const apply = async () => {
    try {
        const buildHelm = await $`helm upgrade --install config -f k8s/values.yaml -n dev k8s`;
        console.log(buildHelm.stdout)
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

const stop = async () => {
    try {
        const stopHelm = await $`helm uninstall config -n dev`;
        console.log(stopHelm.stdout)
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

const run = (option) => {
    switch (option) {
        case "apply":
            apply();
            break;
        case "stop":
            stop();
            break;
        default:
            console.log("zx service.mjs apply|stop");
            break;
    }
}

run(option.length === 0 ? "" : option[0]);