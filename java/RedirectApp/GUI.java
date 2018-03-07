import java.io.*;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;
import java.nio.file.Paths;

public class GUI extends JPanel
                    implements ActionListener {
	private DefaultListModel<String> model;
    private JList<String> list;
    private JButton create_button;
    private JButton delete_button;
    private JButton save_button;
    private JButton push_button;
    private HashMap<String, RedirectingInstance> instancesMap;
    private JTextField res_id_field;
    private JTextField target_field;
    private JTextField input_field;
    private String directory;
    private Runtime rt;
//    private PrintStream ps2;

    public GUI() {
        this.setLayout(new BorderLayout());
        rt = Runtime.getRuntime();

        instancesMap = new HashMap<String, RedirectingInstance>();
        model = new DefaultListModel<String>();
        directory = Paths.get("").toAbsolutePath().toString();

        try {
            Scanner myscanner = new Scanner(new FileReader(directory + "/java/instances.txt"));
            while (myscanner.hasNextLine()) {
                String[] instance = myscanner.nextLine().split(" ");

                model.addElement(instance[0]);
                instancesMap.put(instance[0], new RedirectingInstance(instance[0], instance[1]));
            }
            myscanner.close();
        } catch (Exception e) {
            System.out.println("instances file not found.");
            return;
        }

        JPanel button_panel = new JPanel();
        create_button = new JButton("create");
        create_button.addActionListener(this);
        delete_button = new JButton("delete");
        delete_button.addActionListener(this);
        button_panel.add(create_button);
        button_panel.add(delete_button);

        list = new JList<String>(model);
        // list.setSelectionMode(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION);
        // JList mouse listener
        MouseListener mouseListener = new MouseAdapter() {
            public void mouseClicked(MouseEvent e) {
                if (list.getSelectedValue() == null) return;

                String name = list.getSelectedValue().toString();
                RedirectingInstance instance = instancesMap.get(name);

                res_id_field.setText(instance.res_id);
                target_field.setText(instance.target);
            }
        };
        list.addMouseListener(mouseListener);

        JScrollPane scrollPane = new JScrollPane(list);
        scrollPane.setPreferredSize(new Dimension(100, 200));
        JPanel left_panel = new JPanel();
        left_panel.setLayout(new BorderLayout());
        JLabel description = new JLabel("List of Previously created URL RI's");
        left_panel.add(description, BorderLayout.CENTER);
        left_panel.add(scrollPane, BorderLayout.CENTER);
        left_panel.add(button_panel, BorderLayout.PAGE_END);
        this.add(left_panel, BorderLayout.LINE_START);

        res_id_field = new JTextField();
        res_id_field.setPreferredSize(new Dimension(200, 30));
        target_field = new JTextField();
        target_field.setPreferredSize(new Dimension(200, 30));

        JPanel center_panel = new JPanel();
        center_panel.setLayout(new BorderLayout());

        JPanel infoArea = new JPanel();
        infoArea.setLayout(new BoxLayout(infoArea, BoxLayout.PAGE_AXIS));
        JPanel res_id_panel = new JPanel();
        res_id_panel.add(new JLabel("URL resource identifier: thesoda.io/"));
        res_id_panel.add(res_id_field);
        res_id_panel.setMaximumSize(res_id_panel.getPreferredSize() );

        JPanel target_panel = new JPanel();
        target_panel.add(new JLabel("Target URL:"));
        target_panel.add(target_field);
        infoArea.add(res_id_panel);
        infoArea.add(target_panel);
        target_panel.setMaximumSize(target_panel.getPreferredSize() );

        center_panel.add(infoArea, BorderLayout.PAGE_START);

        save_button = new JButton("save");
        push_button = new JButton("update Github");
        save_button.addActionListener(this);
        push_button.addActionListener(this);
        JPanel bot_button_panel = new JPanel();
        bot_button_panel.add(save_button);
        bot_button_panel.add(push_button);
        center_panel.add(bot_button_panel, BorderLayout.PAGE_END);
        
        	JPanel info_area = new JPanel();
        	info_area.setLayout(new BorderLayout());
        
        JTextArea ta = new JTextArea();
        ta.setEditable(false);
        TextAreaOutputStream taos = new TextAreaOutputStream(ta, 200);
        PrintStream ps = new PrintStream( taos );
        System.setOut( ps );
        System.setErr( ps );
        JScrollPane ta_s = new JScrollPane(ta);
        
        input_field = new JTextField();
        input_field.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				System.out.println(input_field.getText());
				try {
					execute_command(input_field.getText());
				} catch (Exception e1) {
					e1.printStackTrace();
				}
				input_field.setText("");
			}
        
        });
        
        info_area.add(ta_s, BorderLayout.CENTER);
        info_area.add(input_field, BorderLayout.PAGE_END);
        
        center_panel.add(info_area, BorderLayout.CENTER);

        this.add(center_panel, BorderLayout.CENTER);
    }

    private static void createAndShowGUI() {
        JFrame frame = new JFrame("Create new redirecting instance");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        frame.setSize(750, 500);
        frame.add(new GUI());
        frame.setVisible(true);
    }

    public static void main(String[] args) {
        createAndShowGUI();
    }

    public void actionPerformed(ActionEvent event) {
        if (event.getSource() == create_button) {
            String name = "untitled";
            int i = 0;
            while (instancesMap.get(name) != null) {
                i++;
                name = "untitled" + i;
            }

            if (i > 0) {
                name = "untitled" + i;
            }
            model.addElement(name);
            instancesMap.put(name, new RedirectingInstance(name, "https://thesoda.io/"));

            list.setSelectedIndex(0);
        } else if (event.getSource() == save_button || event.getSource() == delete_button) {
            for (HashMap.Entry<String, RedirectingInstance> entry: instancesMap.entrySet()) {
                String name = entry.getKey();
                System.out.println(name);
                File file = new File(name);
                if(file != null && file.delete()) {
                    System.out.println("File deleted successfully");
                } else {
                    System.out.println("Failed to delete the file or file doesn't exist");
                }
            }
            
            if (event.getSource() == delete_button) {
                if (list.getSelectedValue() == null) return;
                String name = list.getSelectedValue().toString();

                model.removeElement(name);
                instancesMap.remove(name);

                if (list.getMinSelectionIndex() > 0) {
                    list.setSelectedIndex(0);
                }
                System.out.println("You deleted it.");
            } else {
                String name = list.getSelectedValue().toString();
                model.setElementAt(res_id_field.getText(), model.indexOf(name));
                instancesMap.remove(name);
                instancesMap.put(res_id_field.getText(), new RedirectingInstance(res_id_field.getText(), target_field.getText()));
            }

            try {
                BufferedWriter out = new BufferedWriter(new FileWriter(directory  + "/instances.txt"));
                for (HashMap.Entry<String, RedirectingInstance> entry: instancesMap.entrySet()) {
                    out.write(entry.getValue().res_id + " " + entry.getValue().target);
                    out.newLine();
                }
                out.close();
            } catch (Exception e) {

            }

            for (HashMap.Entry<String, RedirectingInstance> entry: instancesMap.entrySet()) {
                try {
                    @SuppressWarnings("unused")
					Process process = new ProcessBuilder( directory + "/java/redirect", entry.getValue().res_id, entry.getValue().target).start();
                } catch (Exception e) {
                    System.out.println("failed to run redirect script - contact azaldin 623-760-2571");
                }
            }

        } else if (event.getSource() == push_button) {
        		try {
        			System.out.println("This button doesn't work yet, you need to manually add, commit, and push to Github using the textfield provided below");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
    }
    
    void execute_command(String cmd) throws Exception {
    		Process pr;
    		pr = rt.exec(cmd);
    		BufferedReader stdInput = new BufferedReader(new InputStreamReader(pr.getInputStream()));
		String s = null;
		while ((s = stdInput.readLine()) != null) {
		    System.out.println(s);
		}
		BufferedReader stdError = new BufferedReader(new InputStreamReader(pr.getErrorStream()));
		while ((s = stdError.readLine()) != null) {
		    System.out.println(s);
		}
		pr.waitFor();
    }

    private class RedirectingInstance {
        public String res_id;
        public String target;

        public RedirectingInstance(String res_id, String target) {
            this.res_id = res_id;
            this.target = target;
        }
    }
}