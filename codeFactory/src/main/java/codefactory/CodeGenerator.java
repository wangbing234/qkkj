package codefactory;


import cn.org.rapid_framework.generator.GeneratorFacade;

public class CodeGenerator {

	public static void main(String[] args) throws Exception {
		genterTable();
	}
	
	public static void genterTable() throws Exception{
		  //模板路径
				String templatePath = "C:/Users/bing.wang/Downloads/codeFactory_Maven_Webapp/src/main/resources/template";
				
				GeneratorFacade g = new GeneratorFacade();
				g.getGenerator().addTemplateRootDir(templatePath);
				
//				 删除生成器的输出目录//
				 g.deleteOutRootDir();
				
				// 通过数据库表生成文件
				g.generateByTable("prize_detail");
//				 Table table = TableFactory.getInstance().getTable("meb_statistics");
//				LinkedHashSet<Column> list = table.getColumns();
//				for (Column column : list) {
//					System.out.println(column.getColumnName() +" "+column.getSqlName()); 
//				}
				// 自动搜索数据库中的所有表并生成文件,template为模板的根目录
//				 g.generateByAllTable();
				
				// 按table名字删除文件
//				 g.deleteByTable("table_name", "template");
//				
//				Column s=null;
//				s.simpleJavaType
	}

}
