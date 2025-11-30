package zotte.dingen.cqrs.conversation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class LineTestBuilder {

    private String text;
    private LineType lineType;
    private boolean isPunchLine;
    private List<Participant> participants = new ArrayList<>();

    private LineTestBuilder() {
    }

    public static LineTestBuilder aSpeechLine() {
        return aLine().withLineType(LineType.SPEECH);
    }

    public static LineTestBuilder aContextLine() {
        return aLine().withLineType(LineType.CONTEXT);
    }

    private static LineTestBuilder aLine() {
        return new LineTestBuilder();
    }

    public Line build() {
        Line line = new Line();
        line.setText(text);
        line.setLineType(lineType);
        line.setPunchLine(isPunchLine);
        line.setParticipants(participants);
        return line;
    }

    private LineTestBuilder withLineType(LineType lineType) {
        this.lineType = lineType;
        return this;
    }

    public LineTestBuilder withText(String text) {
        this.text = text;
        return this;
    }

    public LineTestBuilder asPunchLine() {
        this.isPunchLine = true;
        return this;
    }

    public LineTestBuilder withParticipants(List<Participant> participants) {
        this.participants = participants;
        return this;
    }

    public LineTestBuilder withParticipants(Participant... participants) {
        this.participants = Arrays.asList(participants);
        return this;
    }

    public LineTestBuilder withoutParticipants() {
        this.participants = Collections.emptyList();
        return this;
    }
}