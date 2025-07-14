import React, { forwardRef, useCallback, useContext, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Button, Divider, List } from "react-native-paper";
import BottomSheet, { BottomSheetRef } from "~/common/components/BottomSheet";
import ItemWithOptions from "~/common/components/ItemWithOptions";
import { LibraryCheckOptions, LibraryDemographyOptions, LibraryFilterbyOptions, LibraryGenderOptions, LibraryOrderByOptions, LibraryOrderDirOptions, LibraryTypeOptions } from "../constants/SearchFilterOptions";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ItemWithCheckbox } from "~/common/components/ItemWithCheckbox";
import { LibraryGenders } from "~/api/enums/LibraryGenders";
import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import useSafeArea from "~/common/hooks/useSafeArea";
import { LibraryQueriesInterface } from "~/api/interfaces/LibraryQueriesInterface";
import { LibraryQueries } from "~/api/enums/LibraryQueries";

interface IProps {
  onFilter?(): void;
}

export interface SearchFilterSheetRef {
  show(): void;
  getFilters(): Exclude<LibraryQueriesInterface, LibraryQueries.TITLE | LibraryQueries.PAGE | LibraryQueries.STATUS | LibraryQueries.TRANSLATION_STATUS>;
  activeFilters(): number;
}

export const SearchFilterSheet = React.memo(forwardRef(
  function (props: IProps, ref: React.Ref<SearchFilterSheetRef>) {
    const {theme} = useContext(ThemeContext);
    const {bottom, left, right} = useSafeArea(16);
    const refBottomSheet = useRef<BottomSheetRef>(null);

    const accordionTheme = useMemo(() => ({
      ...theme,
      colors: {
        ...theme.colors,
        background: theme.colors.elevation.level4,
      },
    }), [theme]);

    const accordionStyles = useMemo<StyleProp<ViewStyle>>(
      () => ({
        backgroundColor: theme.colors.elevation.level2,
        borderRadius: 2 * theme.roundness,
        marginHorizontal: 8,
        marginVertical: 4,
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

    const onFilter = useCallback(() => {
      props.onFilter?.();
      refBottomSheet.current?.hide();
    }, [props]);

    const clearFilters = useCallback(() => {
      setFilterBy(LibraryFilterbyOptions[0].value);
      setOrderBy(LibraryOrderByOptions[0].value);
      setOrderDir(LibraryOrderDirOptions[0].value);
      setType(LibraryTypeOptions[0].value);
      setDemography(LibraryDemographyOptions[0].value);
      setWebcomic(LibraryCheckOptions[0].value);
      setYonkoma(LibraryCheckOptions[0].value);
      setAmateur(LibraryCheckOptions[0].value);
      setErotic(LibraryCheckOptions[0].value);
      setGenders([]);
      setExcludeGenders([]);

      setTimeout(() => {
        onFilter();
      }, 200);
    }, [onFilter]);

    useImperativeHandle(ref, () => ({
      show() {
        refBottomSheet.current?.show();
      },
      getFilters() {
        return {
          [LibraryQueries.ORDER_ITEM]: orderBy,
          [LibraryQueries.ORDER_DIR]: orderDir,
          [LibraryQueries.FILTER_BY]: filterBy,
          [LibraryQueries.TYPE]: type,
          [LibraryQueries.DEMOGRAPHY]: demography,
          [LibraryQueries.WEBCOMIC]: webcomic,
          [LibraryQueries.YONKOMA]: yonkoma,
          [LibraryQueries.AMATEUR]: amateur,
          [LibraryQueries.EROTIC]: erotic,
          [LibraryQueries.GENDERS]: genders,
          [LibraryQueries.EXCLUDE_GENDERS]: excludeGenders,
        } as ReturnType<SearchFilterSheetRef['getFilters']>;
      },
      activeFilters() {
        let quantity = 0;
        
        quantity += genders.length;
        quantity += excludeGenders.length;

        quantity += Number(filterBy !== LibraryFilterbyOptions[0].value);
        quantity += Number(orderBy !== LibraryOrderByOptions[0].value);
        quantity += Number(orderDir !== LibraryOrderDirOptions[0].value);
        quantity += Number(type !== LibraryTypeOptions[0].value);
        quantity += Number(demography !== LibraryDemographyOptions[0].value);
        quantity += Number(webcomic !== LibraryCheckOptions[0].value);
        quantity += Number(yonkoma !== LibraryCheckOptions[0].value);
        quantity += Number(amateur !== LibraryCheckOptions[0].value);
        quantity += Number(erotic !== LibraryCheckOptions[0].value);

        return quantity;
      },
    }));

    return (
      <BottomSheet
        ref={refBottomSheet}
        title={'Filtros de busqueda'}
        useScrollView={true}
        contentContainerStyle={{
          paddingBottom: bottom + 64,
        }}
        footerComponent={p => (
          <BottomSheetFooter {...p} bottomInset={bottom}>
            <View
              style={{paddingLeft: left, paddingRight: right}}
              className={'w-full pb-[8] flex-row justify-between'}
            >
              <Button
                mode={'contained'}
                compact={true}
                buttonColor={theme.colors.error}
                textColor={theme.colors.errorContainer}
                style={styles.buttons}
                onPress={clearFilters}
              >
                Limpiar
              </Button>

              <Button
                mode={'contained'}
                compact={true}
                style={styles.buttons}
                onPress={onFilter}
              >
                Guardar
              </Button>
            </View>
          </BottomSheetFooter>
        )}
      >
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

const styles = StyleSheet.create({
  buttons: {
    borderRadius: 8,
  },
});
