import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.*;
import com.google.api.services.sheets.v4.Sheets;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

class Event {
    public String startDate, endDate, eventName, eventDescription, location, time, RSVP_link;

    public Event(Sheets service, String spreadsheetId, String range) throws IOException {

        // Sheets.Spreadsheets.Get request = service.spreadsheets().get(spreadsheetId);
        // request.setRanges(ranges);
        // request.setIncludeGridData(true);
        // Spreadsheet response = request.execute();

        ValueRange response = service.spreadsheets().values()
            .get(spreadsheetId, range)
            .execute();

        List<List<Object>> values = response.getValues();
        if (values == null || values.size() == 0) {
            System.out.println("No data found.");
        } else {
            List<Object> row = values.get(0);

            startDate = row.get(26).toString();
            endDate = row.get(27).toString();
            eventName = row.get(2).toString();
            eventDescription = row.get(4).toString();
            location = row.get(5).toString();
            time = row.get(6).toString();
            RSVP_link = row.get(7).toString();
        }
    }
}