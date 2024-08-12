// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useTextValidator } from "../../../frontend/hooks/useTextValidator";

export function useServerNameValidator (
    name : string,
    isRequired ?: boolean,
) {
    return useTextValidator(
        name,
        isRequired,
        'qwertyuiopasdfghjklzxcvbnm',
        'qwertyuiopasdfghjklzxcvbnm0987654321_-',
        'qwertyuiopasdfghjklzxcvbnm0987654321',
        1,
        32,
    );
}
