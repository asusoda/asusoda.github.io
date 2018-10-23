#include <iostream>
#include <string>
#include <fstream>

using namespace std;

int main(int argc, const char** argv) {
	if (argc != 3) {
		cout << "invalid parameters" << endl;
		return 0;
	}

	string res_id = argv[1];
	string link = argv[2];

	string jekyll_front_matter = "---\nredirect_from:-" + res_id + "\n---\n";
	string bp_html_1 = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>redirecting...</title></head><body></body><script>window.location.replace(\"";
	string bp_html_2 = "\");</script></html>";

	ofstream f_o;
	f_o.open(res_id + ".html");
	f_o << bp_html_1 << link << bp_html_2;
	f_o.close();
}