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
import java.io.PrintWriter;

class EventComponentBuilder {
	static void generateComponent(List<Event> events, String name, String title, String array_name) throws IOException {
		PrintWriter writer = new PrintWriter(name);

		// writing javascript array to file to concatenate with react_js.jsx

		writer.printf("var %s = [", array_name);
		for (Event event: events) {
			String date = (event.startDate.equals(event.endDate))? event.startDate : (event.startDate + " - " + event.endDate);
			writer.printf("<Event title=\"%s\" eventName=\"%s\" eventLocation=\"%s\" eventDate=\"%s\" eventTime=\"%s\" eventDescription=\"%s\" formLink=\"%s\"/>,", 
				title,
				event.eventName,
				event.location,
				date,
				event.time,
				event.eventDescription,
				"https://" + event.RSVP_link);
		}
		writer.println("];");
		writer.close();
	}
}