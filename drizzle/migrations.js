// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_huge_kitty_pryde.sql';
import m0001 from './0001_cooing_killer_shrike.sql';
import m0002 from './0002_massive_pixie.sql';
import m0003 from './0003_slippery_lizard.sql';
import m0004 from './0004_friendly_peter_quill.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  