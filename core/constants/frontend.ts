// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { parseNonEmptyString } from "../../../core/types/String";

export const COPYRIGHT_YEAR = '2024';
export const FRONTEND_DEFAULT_LANGUAGE = 'fi';
export const PUBLIC_URL = parseNonEmptyString(process.env.PUBLIC_URL) ?? parseNonEmptyString(process.env.REACT_APP_PUBLIC_URL) ?? 'http://localhost:3000';
