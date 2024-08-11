// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    MENU_ITEMS,
} from "../../core/constants/route";
import { MenuItem } from "../../core/types/MenuItem";

export function useMenuItems (): readonly MenuItem[] {
    return MENU_ITEMS;
}
