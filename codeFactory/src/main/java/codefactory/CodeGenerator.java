package codefactory;


import cn.org.rapid_framework.generator.GeneratorFacade;

public class CodeGenerator {

	public static void main(String[] args) throws Exception {
		genterTable();
	}
	
	public static void genterTable() throws Exception{
		  //ģ��·��
				String templatePath = "C:/Users/bing.wang/Downloads/codeFactory_Maven_Webapp/src/main/resources/template";
				
				GeneratorFacade g = new GeneratorFacade();
				g.getGenerator().addTemplateRootDir(templatePath);
				
//				 ɾ�������������Ŀ¼//
				 g.deleteOutRootDir();
				
				// ͨ�����ݿ�������ļ�
				g.generateByTable("prize_detail");
//				 Table table = TableFactory.getInstance().getTable("meb_statistics");
//				LinkedHashSet<Column> list = table.getColumns();
//				for (Column column : list) {
//					System.out.println(column.getColumnName() +" "+column.getSqlName()); 
//				}
				// �Զ��������ݿ��е����б������ļ�,templateΪģ��ĸ�Ŀ¼
//				 g.generateByAllTable();
				
				// ��table����ɾ���ļ�
//				 g.deleteByTable("table_name", "template");
//				
//				Column s=null;
//				s.simpleJavaType
	}

}
