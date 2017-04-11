public class TextExtractor {
	public static void main (String[] args) {
		String url = args[0];

		URL website = new URL(url);

		String text = ArticleExtractor.INSTANCE.getText(website);
	}
}