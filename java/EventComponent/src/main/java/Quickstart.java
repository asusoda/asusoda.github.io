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
import java.util.ArrayList;

public class Quickstart {
    /** Application name. */
    private static final String APPLICATION_NAME =
        "Google Sheets API Java Quickstart";

    /** Directory to store user credentials for this application. */
    private static final java.io.File DATA_STORE_DIR = new java.io.File(
        System.getProperty("user.home"), ".credentials/sheets.googleapis.com-java-quickstart");

    /** Global instance of the {@link FileDataStoreFactory}. */
    private static FileDataStoreFactory DATA_STORE_FACTORY;

    /** Global instance of the JSON factory. */
    private static final JsonFactory JSON_FACTORY =
        JacksonFactory.getDefaultInstance();

    /** Global instance of the HTTP transport. */
    private static HttpTransport HTTP_TRANSPORT;

    /** Global instance of the scopes required by this quickstart.
     *
     * If modifying these scopes, delete your previously saved credentials
     * at ~/.credentials/sheets.googleapis.com-java-quickstart
     */
    private static final List<String> SCOPES =
        Arrays.asList(SheetsScopes.SPREADSHEETS_READONLY);

    static {
        try {
            HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            DATA_STORE_FACTORY = new FileDataStoreFactory(DATA_STORE_DIR);
        } catch (Throwable t) {
            t.printStackTrace();
            System.exit(1);
        }
    }

    /**
     * Creates an authorized Credential object.
     * @return an authorized Credential object.
     * @throws IOException
     */
    public static Credential authorize() throws IOException {
        // Load client secrets.
        InputStream in =
            Quickstart.class.getResourceAsStream("/client_secret.json");
        GoogleClientSecrets clientSecrets =
            GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow =
                new GoogleAuthorizationCodeFlow.Builder(
                        HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(DATA_STORE_FACTORY)
                .setAccessType("offline")
                .build();
        Credential credential = new AuthorizationCodeInstalledApp(
            flow, new LocalServerReceiver()).authorize("user");
        System.out.println(
                "Credentials saved to " + DATA_STORE_DIR.getAbsolutePath());
        return credential;
    }

    /**
     * Build and return an authorized Sheets API client service.
     * @return an authorized Sheets API client service
     * @throws IOException
     */
    public static Sheets getSheetsService() throws IOException {
        Credential credential = authorize();
        return new Sheets.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public static void main(String[] args) throws IOException {
        // Build a new authorized API client service.
        Quickstart qs = new Quickstart();
        Sheets service = getSheetsService();

        String spreadsheetId = qs.getCurrentSpreadSheetID(service);

        String numEventsThisWeekCell = "A2";
        String numEventsNextWeekCell = "C2";
        String rangeEventsThisWeekCell = "B2";
        String rangeEventsNextWeekCell = "D2";

        int numEventsThisWeek = Integer.parseInt(qs.getCellValue(service, spreadsheetId, numEventsThisWeekCell));
        int numEventsNextWeek = Integer.parseInt(qs.getCellValue(service, spreadsheetId, numEventsNextWeekCell));

        List<Event> eventsThisWeek = new ArrayList<Event>();
        int row = Integer.parseInt(qs.getCellValue(service, spreadsheetId, rangeEventsThisWeekCell));
        
        for (int i = 0; i < numEventsThisWeek; i++) {
            eventsThisWeek.add(new Event(service, spreadsheetId, "A" + (row + i) + ":AB" + (row + i)));
        }

        List<Event> eventsNextWeek = new ArrayList<Event>();
        row = Integer.parseInt(qs.getCellValue(service, spreadsheetId, rangeEventsNextWeekCell));

        for (int i = 0; i < numEventsNextWeek; i++) {
            eventsNextWeek.add(new Event(service, spreadsheetId, "A" + (row + i) + ":AB" + (row + i)));
        }

        EventComponentBuilder.generateComponent(eventsThisWeek, "CompiledEventComponentsFiles/events1.txt", "UPCOMING EVENTS", "EventsThisWeekList");
        EventComponentBuilder.generateComponent(eventsNextWeek, "CompiledEventComponentsFiles/events2.txt", "EVENTS NEXT WEEK", "EventsNextWeekList");
    
    }

    /*
        Returns the SpreadSheetID that corresponds to the Events Spreadsheet for the current semester, you can tweak this by accessing the share link to that Spreadsheet below:
        https://docs.google.com/spreadsheets/d/1-OXLwptf-Rlq4B6csRSC_-6xSgsGbY4CMSoapKs6KBE/edit?usp=sharing
        If it doesn't work, contact azaldin 623-760-2571
    */
    public String getCurrentSpreadSheetID(Sheets service) throws IOException {
        String spreadsheetId = "1-OXLwptf-Rlq4B6csRSC_-6xSgsGbY4CMSoapKs6KBE";
        String range = "C13";
        ValueRange response = service.spreadsheets().values()
            .get(spreadsheetId, range)
            .execute();
        List<List<Object>> values = response.getValues();
        return values.get(0).get(0).toString();
    }

    public String getCellValue(Sheets service, String spreadsheetId, String range) throws IOException {
        ValueRange response = service.spreadsheets().values()
            .get(spreadsheetId, range)
            .execute();
        List<List<Object>> values = response.getValues();
        return values.get(0).get(0).toString();
    }
}