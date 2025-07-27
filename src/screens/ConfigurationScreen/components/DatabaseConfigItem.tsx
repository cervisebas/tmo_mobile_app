import React, { useMemo } from "react";
import { useSavedBooks } from "../hooks/useSavedBooks";
import ItemWithIcon from "~/common/components/ItemWithIcon";

export const DatabaseConfigItem = React.memo(function () {
  const {booksWithoutInfo, booksWithInfo} = useSavedBooks();

  const databaseDescription = useMemo(
    () => {
      let description = '';
      description += `Libros con información: ${booksWithInfo}\n`;
      description += `Libros sin información: ${booksWithoutInfo}`;

      return description;
    },
    [booksWithoutInfo, booksWithInfo],
  );

  return (
    <ItemWithIcon
      title={'Base de datos'}
      leftIcon={'database'}
      description={databaseDescription}
    />
  );
});
