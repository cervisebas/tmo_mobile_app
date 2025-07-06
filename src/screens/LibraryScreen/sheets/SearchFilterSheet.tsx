import React, { forwardRef, useContext, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Divider, List } from "react-native-paper";
import BottomSheet, { BottomSheetRef } from "~/common/components/BottomSheet";
import ItemWithOptions from "~/common/components/ItemWithOptions";
import { LibraryCheckOptions, LibraryDemographyOptions, LibraryFilterbyOptions, LibraryGenderOptions, LibraryOrderByOptions, LibraryOrderDirOptions, LibraryTypeOptions } from "../constants/SearchFilterOptions";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { StyleProp, ViewStyle } from "react-native";
import { ItemWithCheckbox } from "~/common/components/ItemWithCheckbox";
import { LibraryGenders } from "~/api/enums/LibraryGenders";

interface IProps {}

export interface SearchFilterSheetRef {
  show(): void;
}

export const SearchFilterSheet = React.memo(forwardRef(
  function (props: IProps, ref: React.Ref<SearchFilterSheetRef>) {
    const {theme} = useContext(ThemeContext);
    const refBottomSheet = useRef<BottomSheetRef>(null);

    const accordionTheme = useMemo(() => ({
      ...theme,
      colors: {
        ...theme.colors,
        background: theme.colors.elevation.level2,
      },
    }), [theme]);

    const accordionStyles = useMemo<StyleProp<ViewStyle>>(
      () => ({
        backgroundColor: theme.colors.elevation.level5,
        borderRadius: 2 * theme.roundness,
        margin: 8,
      }),
      [theme],
    );

    // Search options
    const [filterBy, setFilterBy] = useState(LibraryFilterbyOptions[0].value);
    const [orderBy, setOrderBy] = useState(LibraryOrderByOptions[0].value);
    const [orderDir, setOrderDir] = useState(LibraryOrderDirOptions[0].value);
    
    // Filters
    const [type, setType] = useState(LibraryTypeOptions[0].value);
    const [demography, setDemography] = useState(LibraryDemographyOptions[0].value);
    const [webcomic, setWebcomic] = useState(LibraryCheckOptions[0].value);
    const [yonkoma, setYonkoma] = useState(LibraryCheckOptions[0].value);
    const [amateur, setAmateur] = useState(LibraryCheckOptions[0].value);
    const [erotic, setErotic] = useState(LibraryCheckOptions[0].value);

    // Genders
    const [genders, setGenders] = useState<LibraryGenders[]>([]);
    const [excludeGenders, setExcludeGenders] = useState<LibraryGenders[]>([]);

    useImperativeHandle(ref, () => ({
      show() {
        refBottomSheet.current?.show();
      },
    }));

    return (
      <BottomSheet ref={refBottomSheet} useScrollView title={'Filtros de busqueda'}>
        <List.AccordionGroup>
          <List.Accordion id={'1'} theme={accordionTheme} title={'Opciónes de busqueda'} style={accordionStyles}>
            <ItemWithOptions
              title={'Buscar por:'}
              options={LibraryFilterbyOptions}
              value={filterBy}
              onChange={setFilterBy as any}
            />

            <Divider className={'mx-[12]'} />
            
            <ItemWithOptions
              title={'Ordenar por:'}
              options={LibraryOrderByOptions}
              value={orderBy}
              onChange={setOrderBy as any}
            />

            <Divider className={'mx-[12]'} />
            
            <ItemWithOptions
              title={'Ordenar en:'}
              options={LibraryOrderDirOptions}
              value={orderDir}
              onChange={setOrderDir as any}
            />
          </List.Accordion>

          <List.Accordion id={'2'} theme={accordionTheme} title={'Filtros'} style={accordionStyles}>
            <ItemWithOptions
              title={'Tipo:'}
              options={LibraryTypeOptions}
              value={type}
              onChange={setType as any}
            />

            <Divider className={'mx-[12]'} />
            
            <ItemWithOptions
              title={'Demografía:'}
              options={LibraryDemographyOptions}
              value={demography}
              onChange={setDemography as any}
            />

            <Divider className={'mx-[12]'} />
            
            <ItemWithOptions
              title={'Webcomic:'}
              options={LibraryCheckOptions}
              value={webcomic}
              onChange={setWebcomic as any}
            />

            <Divider className={'mx-[12]'} />
            
            <ItemWithOptions
              title={'Yonkoma:'}
              options={LibraryCheckOptions}
              value={yonkoma}
              onChange={setYonkoma as any}
            />

            <Divider className={'mx-[12]'} />
            
            <ItemWithOptions
              title={'Amateur:'}
              options={LibraryCheckOptions}
              value={amateur}
              onChange={setAmateur as any}
            />

            <Divider className={'mx-[12]'} />
            
            <ItemWithOptions
              title={'Erótico:'}
              options={LibraryCheckOptions}
              value={erotic}
              onChange={setErotic as any}
            />
          </List.Accordion>

          <List.Accordion id={'3'} theme={accordionTheme} title={'Géneros'} style={accordionStyles}>
            {LibraryGenderOptions.map(({label, value}, index, array) => (
              <React.Fragment key={value}>
                <ItemWithCheckbox
                  title={label}
                  checked={genders.includes(value)}
                  onChecked={() => {
                    setGenders(genders => 
                      genders.includes(value)
                        ? genders.filter(g => g !== value)
                        : [...genders, value]
                    );
                  }}
                />

                {array[index + 1] && (
                  <Divider className={'mx-[12]'} />
                )}
              </React.Fragment>
            ))}
          </List.Accordion>

          <List.Accordion id={'4'} theme={accordionTheme} title={'Excluir Géneros'} style={accordionStyles}>
            {LibraryGenderOptions.map(({label, value}, index, array) => (
              <React.Fragment key={value}>
                <ItemWithCheckbox
                  title={label}
                  checked={excludeGenders.includes(value)}
                  onChecked={() => {
                    setExcludeGenders(genders => 
                      genders.includes(value)
                        ? genders.filter(g => g !== value)
                        : [...genders, value]
                    );
                  }}
                />

                {array[index + 1] && (
                  <Divider className={'mx-[12]'} />
                )}
              </React.Fragment>
            ))}
          </List.Accordion>
        </List.AccordionGroup>
      </BottomSheet>
    );
  }
));
