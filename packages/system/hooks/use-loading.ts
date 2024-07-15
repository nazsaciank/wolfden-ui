import { useState } from "react";

export function useLoading(defaultLoading: boolean = false) {
    const [isLoading, setLoading] = useState(defaultLoading);

    function startLoading(cb: () => Promise<void>) {
        setLoading(true);
        return cb().finally(() => setLoading(false));
    }

    return [isLoading, startLoading] as const;
}
