import React from "react";
import { Grid, TablePagination, Typography, useTheme } from "@mui/material";
import { SearchForm } from "./SearchForm";
import {
  useSearchReportsMutation,
  useGetRecordByIdMutation,
} from "../../api/reports/reportsApi";
import { RecordDto, RecordSearchDto } from "../../api/swagger/swagger.api";
import SearchResultsDisplayer from "./SearchResultsDisplayer";

export const Reports: React.FC = () => {
  const [search, { isLoading }] = useSearchReportsMutation();
  const [getRecordById, { isLoading: recordLoading }] =
    useGetRecordByIdMutation();

  const [searchResults, setSearchResults] = React.useState<RecordDto[]>([]);
  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [prevSearch, setPrevSearch] = React.useState<RecordSearchDto | null>(
    null
  );

  const handleSearch = (formData: RecordSearchDto) => {
    const updatedFormData = { ...formData, page, pageSize: rowsPerPage };
    search(updatedFormData)
      .unwrap()
      .then((data) => {
        setSearchResults(data.records as RecordDto[]);
        setTotalResults(data.total as number);
        setPrevSearch(updatedFormData);
      });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);

    if (prevSearch) {
      const updatedFormData = {
        ...prevSearch,
        page: newPage,
        pageSize: rowsPerPage,
      };
      search(updatedFormData)
        .unwrap()
        .then((data) => {
          setSearchResults(data.records as RecordDto[]);
          setTotalResults(data.total as number);
        });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);

    if (prevSearch) {
      const updatedFormData = {
        ...prevSearch,
        page: 1,
        pageSize: newRowsPerPage,
      };
      search(updatedFormData)
        .unwrap()
        .then((data) => {
          setSearchResults(data.records as RecordDto[]);
          setTotalResults(data.total as number);
        });
    }
  };
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SearchForm onSubmitCallback={handleSearch} loading={isLoading} />
      </Grid>

      {searchResults?.length > 0 && (
        <Grid item xs={12}>
          <div
            style={{
              position: "sticky",
              top: 50,
              zIndex: 1000,
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" align="center" paddingLeft={2}>
              Search Results
            </Typography>
            <TablePagination
              component="div"
              count={totalResults}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
          <SearchResultsDisplayer
            searchResults={searchResults}
            loading={isLoading}
          />
        </Grid>
      )}
    </Grid>
  );
};
